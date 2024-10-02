import {
  ConstantFieldMeta,
  ConstantFieldProps,
  ReturnType,
  type Type,
  getClassMeta,
  getFieldMetaMapOnPrototype,
  getNonArrayModel,
  isGqlMap,
  isGqlScalar,
  scalarNameMap,
  setFieldMetaMapOnPrototype,
} from "./scalar";

const applyFieldMeta = (
  modelRef: Type,
  arrDepth: number,
  option: ConstantFieldProps,
  optionArrDepth: number
): PropertyDecorator => {
  const isArray = arrDepth > 0;
  const isClass = !isGqlScalar(modelRef);
  const isMap = isGqlMap(modelRef);
  const { refName, type } = isClass ? getClassMeta(modelRef) : { refName: "", type: "scalar" };
  const name = isClass ? refName : scalarNameMap.get(modelRef) ?? "Unknown";
  if (isMap && !option.of) throw new Error("Map type must have 'of' option");
  return (prototype: object, key: string) => {
    const metadata: ConstantFieldMeta = {
      nullable: option.nullable ?? false,
      ref: option.ref,
      refPath: option.refPath,
      refType: option.refType,
      default: option.default ?? (isArray ? [] : null),
      type: option.type,
      fieldType: option.fieldType ?? "property",
      immutable: option.immutable ?? false,
      min: option.min,
      max: option.max,
      enum: option.enum,
      select: option.select ?? true,
      minlength: option.minlength,
      maxlength: option.maxlength,
      query: option.query,
      accumulate: option.accumulate,
      example: option.example,
      validate: option.validate,
      key,
      name,
      isClass,
      isScalar: type === "scalar",
      modelRef,
      arrDepth,
      isArray,
      optArrDepth: optionArrDepth,
      isMap,
      of: option.of,
      text: option.text,
    };
    const metadataMap = getFieldMetaMapOnPrototype(prototype);
    metadataMap.set(key, metadata);
    setFieldMetaMapOnPrototype(prototype, metadataMap);
  };
};

const makeField =
  (customOption: Partial<ConstantFieldProps>) =>
  (
    returns: ReturnType,
    fieldOption?:
      | Omit<ConstantFieldProps, "fieldType" | "select">
      | Omit<ConstantFieldProps, "nullable" | "fieldType" | "select">[]
  ) => {
    const [modelRef, arrDepth] = getNonArrayModel<Type>(returns() as Type);
    if (!fieldOption) return applyFieldMeta(modelRef, arrDepth, { ...customOption }, arrDepth);
    const [opt, optArrDepth] = getNonArrayModel(fieldOption);
    return applyFieldMeta(modelRef, arrDepth, { ...opt, ...customOption }, optArrDepth);
  };

export const Field = {
  Prop: makeField({ fieldType: "property" }),
  Hidden: makeField({ fieldType: "hidden", nullable: true }),
  Secret: makeField({ fieldType: "hidden", select: false, nullable: true }),
  Resolve: makeField({ fieldType: "resolve" }),
};
