pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title CommonERC20
 * @dev Implementation of the CommonERC20
 */
contract ERC20Migratable is ERC20Burnable, AccessControl, Pausable {
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
    uint256 public maxSupply = 0;
    uint256 public supplyable = 0;
    uint256 public accumulatedDeposit = 0;
    uint256 public accumulatedWithdraw = 0;

    mapping(address => mapping(uint256 => uint256)) public depositMap;
    mapping(address => mapping(bytes32 => uint256)) public withdrawMap;

    event Deposit(address indexed from, uint256 value);
    event RegisterWithdrawal(address indexed to, bytes32 txHash, uint256 value);
    event UnregisterWithdrawal(address indexed to, bytes32 txHash, uint256 value);
    event Withdraw(address indexed to, bytes32 txHash, uint256 value);

    constructor(string memory name, string memory symbol) payable ERC20(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setSupply(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) returns (bool) {
        if (amount >= maxSupply) {
            uint256 increased = amount - maxSupply;
            _mint(address(this), increased);
            supplyable += increased;
            maxSupply += increased;
        } else {
            uint256 decreased = maxSupply - amount;
            if (decreased > supplyable) revert("ERC20: burn amount exceeds supplyable");
            else if (decreased > balanceOf(address(this))) revert("ERC20: burn amount exceeds balance");
            _burn(address(this), decreased);
            supplyable -= decreased;
            maxSupply -= decreased;
        }
        return true;
    }

    function deposit(uint256 amount) external whenNotPaused {
        // msg.sender의 balance를 amount만큼 줄이고, depositMap에 이를 기록한다.
        _transfer(msg.sender, address(this), amount);
        depositMap[msg.sender][block.number] += amount;
        supplyable += amount;
        accumulatedDeposit += amount;
        emit Deposit(msg.sender, amount);
    }

    function registerWithdrawal(
        address addr,
        bytes32 txHash,
        uint256 amount
    ) external onlyRole(REGISTRAR_ROLE) returns (bool) {
        // withdrawMap에 address => txHash => amount만큼 기록한다.
        if (withdrawMap[addr][txHash] != 0) revert("Already Registered");
        if (amount == 1) revert("Minimum Amount is 2");
        if (amount > supplyable) revert("Not Enough Supplyable");
        withdrawMap[addr][txHash] = amount;
        supplyable -= amount;
        emit RegisterWithdrawal(addr, txHash, amount);
        return true;
    }

    function unregisterWithdrawal(address addr, bytes32 txHash) external onlyRole(REGISTRAR_ROLE) returns (bool) {
        uint256 amount = withdrawMap[addr][txHash];
        if (amount == 0) revert("No Registration Found");
        if (amount == 1) revert("Already Withdrawn");
        withdrawMap[addr][txHash] = 0;
        supplyable += amount;
        emit UnregisterWithdrawal(addr, txHash, amount);
        return true;
    }

    function withdraw(bytes32 txHash, uint256 amount) external whenNotPaused {
        // withdrawMap의 값과 일치하면 msg.sender의 balance를 amount만큼 늘리고, withdrawMap에서 해당 값을 빼고 1(무쓸모값)으로 만든다.
        uint256 balance = withdrawMap[msg.sender][txHash];
        if (balance != amount) revert("Invalid Amount");
        else if (balance == 0) revert("No Balance");
        else if (balance == 1) revert("Already Processed");
        _transfer(address(this), msg.sender, amount);
        withdrawMap[msg.sender][txHash] = 1;
        accumulatedWithdraw += amount;
        emit Withdraw(msg.sender, txHash, amount);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
