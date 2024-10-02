"use client";
import { lazy } from "@core/next";

export const ExecuteContract = lazy(() => import("./ExecuteContract"));
export const SendErc20 = lazy(() => import("./SendErc20"));
export const SignWallet = lazy(() => import("./SignWallet"));
export const ConnectMetamask = lazy(() => import("./ConnectMetamask"));
