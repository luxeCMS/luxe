type ValidationError = {
  message: string;
  code?: string;
  path?: string[];
};

type FieldCondition<T = unknown, C = unknown> =
  | boolean
  | ((value: T, context: C) => boolean | Promise<boolean>);

type ValidationFunction<T = unknown, C = unknown> = (
  value: T,
  context: C,
) => ValidationError[] | Promise<ValidationError[]>;

type DisplayOptions = {
  placeholder?: string;
  description?: string;
  group?: string;
  help?: string;
  width?: "full" | "half" | "third" | number;
  layout?: "horizontal" | "vertical";
  className?: string;
};

type FieldHooks<T = unknown, C = unknown> = {
  beforeValidate?: (value: T, context: C) => T | Promise<T>;
  afterValidate?: (value: T, context: C) => T | Promise<T>;
  beforeSave?: (value: T, context: C) => T | Promise<T>;
  afterSave?: (value: T, context: C) => T | Promise<T>;
  beforeLoad?: (value: T, context: C) => T | Promise<T>;
  afterLoad?: (value: T, context: C) => T | Promise<T>;
  onChange?: (value: T, context: C) => void | Promise<void>;
};

export interface BaseFieldConfig<T = unknown, C = unknown> {
  name: string;
  label: string;
  description?: string;
  required?: boolean | FieldCondition<T, C>;
  unique?: boolean | FieldCondition<T, C>;
  defaultValue?: T | (() => T) | (() => Promise<T>);
  hidden?: FieldCondition<T, C>;
  readOnly?: FieldCondition<T, C>;
  disabled?: FieldCondition<T, C>;
  validate?: ValidationFunction<T, C> | ValidationFunction<T, C>[];
  transform?: (value: T) => T | Promise<T>;
  sanitize?: (value: T) => T | Promise<T>;
  displayOptions?: DisplayOptions;
  hooks?: FieldHooks<T, C>;
  permissions?: {
    read?: FieldCondition<T, C>;
    write?: FieldCondition<T, C>;
    delete?: FieldCondition<T, C>;
  };
}

export abstract class BaseField<T = unknown, C = unknown> {
  readonly type: string;
  readonly name: string;
  readonly label: string;
  readonly description?: string;

  #required: FieldCondition<T, C>;
  #unique: FieldCondition<T, C>;
  #hidden: FieldCondition<T, C>;
  #readOnly: FieldCondition<T, C>;
  #disabled: FieldCondition<T, C>;
  #defaultValue?: T | (() => T) | (() => Promise<T>);
  #validators: ValidationFunction<T, C>[];
  #transform?: (value: T) => T | Promise<T>;
  #sanitize?: (value: T) => T | Promise<T>;

  readonly displayOptions: DisplayOptions;
  readonly hooks: FieldHooks<T, C>;
  readonly permissions: {
    read: FieldCondition<T, C>;
    write: FieldCondition<T, C>;
  };

  protected constructor(config: BaseFieldConfig<T, C>) {
    this.type = this.constructor.name;
    this.name = config.name;
    this.label = config.label;
    this.description = config.description;

    this.#required = config.required ?? false;
    this.#unique = config.unique ?? false;
    this.#hidden = config.hidden ?? false;
    this.#readOnly = config.readOnly ?? false;
    this.#disabled = config.disabled ?? false;
    this.#defaultValue = config.defaultValue;

    this.#validators = Array.isArray(config.validate)
      ? config.validate
      : config.validate
      ? [config.validate]
      : [];

    this.#transform = config.transform;
    this.#sanitize = config.sanitize;

    this.displayOptions = {
      ...config.displayOptions,
      width: "full",
      layout: "vertical",
    };

    this.hooks = config.hooks ?? {};

    this.permissions = {
      read: config.permissions?.read ?? true,
      write: config.permissions?.write ?? true,
    };
  }

  async isRequired(context: C): Promise<boolean> {
    return typeof this.#required === "function"
      ? await this.#required(null as unknown as T, context)
      : this.#required;
  }

  async isUnique(context: C): Promise<boolean> {
    return typeof this.#unique === "function"
      ? await this.#unique(null as unknown as T, context)
      : this.#unique;
  }

  async isHidden(context: C): Promise<boolean> {
    return typeof this.#hidden === "function"
      ? await this.#hidden(null as unknown as T, context)
      : this.#hidden;
  }

  async isReadOnly(context: C): Promise<boolean> {
    return typeof this.#readOnly === "function"
      ? await this.#readOnly(null as unknown as T, context)
      : this.#readOnly;
  }

  async isDisabled(context: C): Promise<boolean> {
    return typeof this.#disabled === "function"
      ? await this.#disabled(null as unknown as T, context)
      : this.#disabled;
  }

  async getDefaultValue(): Promise<T | undefined> {
    if (this.#defaultValue instanceof Function) {
      return await this.#defaultValue();
    }
    return this.#defaultValue;
  }

  async validate(value: T, context: C): Promise<ValidationError[]> {
    let tempValue: T = value;
    try {
      if (this.hooks.beforeValidate) {
        tempValue = await this.hooks.beforeValidate(tempValue, context);
      }

      const errors: ValidationError[] = [];

      if (
        (await this.isRequired(context)) &&
        (tempValue === undefined || tempValue === null)
      ) {
        errors.push({
          message: `${this.label} is required`,
          code: "required",
          path: [this.name],
        });
      }

      for (const validator of this.#validators) {
        const validationErrors = await validator(tempValue, context);
        errors.push(...validationErrors);
      }

      if (this.hooks.afterValidate) {
        tempValue = await this.hooks.afterValidate(tempValue, context);
      }

      return errors;
    } catch (error) {
      return [
        {
          message: error instanceof Error ? error.message : "Validation failed",
          code: "validation_error",
          path: [this.name],
        },
      ];
    }
  }

  async transformValue(value: T): Promise<T> {
    if (this.#transform) {
      return await this.#transform(value);
    }
    return value;
  }

  async sanitizeValue(value: T): Promise<T> {
    if (this.#sanitize) {
      return await this.#sanitize(value);
    }
    return value;
  }

  abstract serialize(value: T): unknown;
  abstract deserialize(value: unknown): T;
}
