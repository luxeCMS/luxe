import type { z } from "zod";
import type {
  varchar,
  integer,
  boolean,
  date,
  time,
  timestamp,
  jsonb,
  smallint,
  char,
  bigint,
  serial,
  smallserial,
  bigserial,
} from "drizzle-orm/pg-core";

type PostgresColumnType = ReturnType<
  | typeof varchar
  | typeof char
  | typeof integer
  | typeof smallint
  | typeof bigint
  | typeof serial
  | typeof smallserial
  | typeof bigserial
  | typeof jsonb
  | typeof boolean
  | typeof date
  | typeof time
  | typeof timestamp
>;

export type FieldSchemaDefineProps<T> = {
  name: string;
  label: string;
  defaultValue?: T | (() => T | Promise<T>);
};

export type FieldSchema<Name extends string, Type = unknown> = {
  database: {
    type: PostgresColumnType;
  };
} & {
  [P in `define${Capitalize<Name>}`]: (
    options: FieldSchemaDefineProps<Type>,
  ) => FieldSchemaDefineProps<Type>;
};

export function createField<Name extends string, Type>(
  create: () => () => FieldSchema<Name, Type>,
): () => FieldSchema<Name, Type> {
  return create();
}

// *********************************************************************************************************

type ValidationError = {
  message: string;
  code?: string;
  path?: (string | number)[];
};

type FieldCondition<C = unknown> =
  | boolean
  | ((context: C) => boolean | Promise<boolean>);

type DisplayOptions = {
  placeholder?: string;
  description?: string;
  group?: string;
  help?: string;
  width?: "full" | "half" | "third" | number;
  layout?: "horizontal" | "vertical";
  className?: string;
};

export interface BaseFieldConfig<T = unknown, C = unknown> {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  unique?: boolean;
  defaultValue?: T | (() => T | Promise<T>);
  hidden?: FieldCondition<C>;
  readOnly?: FieldCondition<C>;
  disabled?: FieldCondition<C>;
  transform?: (value: T) => T | Promise<T>;
  displayOptions?: DisplayOptions;
  permissions?: {
    read?: FieldCondition<C>;
    write?: FieldCondition<C>;
    delete?: FieldCondition<C>;
  };
}

export abstract class BaseField<T, C = unknown> {
  readonly type: string;
  readonly name: string;
  readonly label: string;
  readonly description?: string;

  abstract schema: z.ZodType<T>;

  #required: FieldCondition<C>;
  #unique: FieldCondition<C>;
  #hidden: FieldCondition<C>;
  #readOnly: FieldCondition<C>;
  #disabled: FieldCondition<C>;
  #defaultValue?: T | (() => T | Promise<T>);
  #transform?: (value: T) => T | Promise<T>;

  readonly displayOptions: DisplayOptions;
  readonly permissions: {
    read: FieldCondition<C>;
    write: FieldCondition<C>;
    delete: FieldCondition<C>;
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

    this.#transform = config.transform;

    this.displayOptions = {
      width: "full",
      layout: "vertical",
      ...config.displayOptions,
    };

    this.permissions = {
      read: config.permissions?.read ?? true,
      write: config.permissions?.write ?? true,
      delete: config.permissions?.delete ?? true,
    };
  }

  async isRequired(context: C): Promise<boolean> {
    return typeof this.#required === "function"
      ? await this.#required(context)
      : this.#required;
  }

  async isUnique(context: C): Promise<boolean> {
    return typeof this.#unique === "function"
      ? await this.#unique(context)
      : this.#unique;
  }

  async isHidden(context: C): Promise<boolean> {
    return typeof this.#hidden === "function"
      ? await this.#hidden(context)
      : this.#hidden;
  }

  async isReadOnly(context: C): Promise<boolean> {
    return typeof this.#readOnly === "function"
      ? await this.#readOnly(context)
      : this.#readOnly;
  }

  async isDisabled(context: C): Promise<boolean> {
    return typeof this.#disabled === "function"
      ? await this.#disabled(context)
      : this.#disabled;
  }

  async getDefaultValue(): Promise<T | undefined> {
    if (this.#defaultValue instanceof Function) {
      return await this.#defaultValue();
    }
    return this.#defaultValue;
  }

  async validate(value: unknown, context: C): Promise<ValidationError[]> {
    try {
      const errors: ValidationError[] = [];

      if (await this.isRequired(context)) {
        if (value === undefined || value === null) {
          errors.push({
            message: `${this.label} is required`,
            code: "required",
            path: [this.name],
          });
          return errors;
        }
      }

      const result = await this.schema.safeParseAsync(value);
      if (!result.success) {
        return result.error.errors.map((err) => ({
          message: err.message,
          code: err.code,
          path: err.path.map(String),
        }));
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

  serialize(value: T): unknown {
    return this.schema.parse(value);
  }

  deserialize(value: unknown): T {
    return this.schema.parse(value);
  }

  abstract render(value: T, context: C): Promise<unknown>;
}
