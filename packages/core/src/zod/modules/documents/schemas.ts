export type BaseSchemaTypes =
  | "text"
  | "paragraph"
  | "number"
  | "toggle"
  | "list"
  | "object"
  | "reference"
  | "media"
  | "date"
  | "datetime"
  | "daterange"
  | "email"
  | "password"
  | "url"
  | "richtext"
  | "color";

type FieldCondition<T = unknown> =
  | boolean
  | ((context: T) => boolean)
  | ((context: T) => Promise<boolean>);

export interface BaseField<TContext = unknown> {
  /**
   * The name of the field, used as a key in the object.
   */
  name: string;

  /**
   * The type of the field. This determines the type of the value.
   */
  type: BaseSchemaTypes;

  /**
   * The label of the field, used in the UI.
   */
  label: string;

  /**
   * The description of the field, used in the UI.
   */
  description?: string;

  /**
   * Whether the field is required. All fields are optional by default.
   */
  required?: FieldCondition<TContext>;

  /**
   * Whether the field is unique. All fields are not unique by default.
   */
  unique?: boolean;

  /**
   * Whether the field is hidden. All fields are not hidden by default.
   */
  hidden?: FieldCondition<TContext>;
}

export interface TextSchema<TContext = unknown> extends BaseField<TContext> {
  /**
   * A text field, used for short strings.
   */
  type: "text";

  /**
   * The default text value.
   */
  defaultValue?: string;
}

export interface ParagraphSchema<TContext = unknown>
  extends BaseField<TContext> {
  /**
   * A paragraph field, used for long strings.
   */
  type: "paragraph";

  /**
   * The default paragraph value.
   */
  defaultValue?: string;
}

export interface NumberSchema<TContext = unknown> extends BaseField<TContext> {
  /**
   * A number field, used for integers, floats, etc.
   */
  type: "number";

  /**
   * The default number value.
   */
  defaultValue?: number;
}

export interface ToggleSchema<TContext = unknown> extends BaseField<TContext> {
  /**
   * A toggle field, used for true/false values, also known as a boolean.
   */
  type: "toggle";

  /**
   * The default toggle value.
   */
  defaultValue?: boolean;
}

export interface ArraySchema<TContext = unknown> extends BaseField<TContext> {
  /**
   * An array field, used for lists of values.
   */
  type: "list";

  /**
   * The schema of the array. What type of values are in the array.
   */
  of: Schema<TContext>;
}

export interface ObjectSchema<TContext = unknown> extends BaseField<TContext> {
  /**
   * An object field, used for nested objects.
   */
  type: "object";

  /**
   * The fields that make up this object.
   */
  fields: Record<string, Schema<TContext>>;
}

export interface ReferenceSchema<TContext = unknown>
  extends BaseField<TContext> {
  /**
   * A reference field, used for referencing other schemas.
   */
  type: "reference";

  /**
   * The name of the schema to reference.
   */
  to: string;
}

export interface MediaSchema<TContext = unknown> extends BaseField<TContext> {
  /**
   * A media field, used for referencing media files.
   */
  type: "media";
}

export interface DateSchema<TContext = unknown> extends BaseField<TContext> {
  /**
   * A date field, used for dates.
   */
  type: "date";

  /**
   * The default date value.
   */
  defaultValue?: string | Date;
}

export interface DateTimeSchema<TContext = unknown>
  extends BaseField<TContext> {
  /**
   * A datetime field, used for dates and times.
   */
  type: "datetime";

  /**
   * The default datetime value.
   */
  defaultValue?: string | Date;
}

export interface DateRangeSchema<TContext = unknown>
  extends BaseField<TContext> {
  /**
   * A date range field, used for date ranges.
   */
  type: "daterange";

  /**
   * The default date range value.
   */
  defaultValue?: [string | Date, string | Date];
}

export interface EmailSchema<TContext = unknown> extends BaseField<TContext> {
  /**
   * An email field, used for email addresses.
   */
  type: "email";

  /**
   * The default email value.
   */
  defaultValue?: string;
}

export interface PasswordSchema<TContext = unknown>
  extends BaseField<TContext> {
  /**
   * A password field, used for passwords.
   */
  type: "password";

  /**
   * The default password value.
   */
  defaultValue?: string;
}

export interface UrlSchema<TContext = unknown> extends BaseField<TContext> {
  /**
   * A URL field, used for URLs.
   */
  type: "url";

  /**
   * The default URL value.
   */
  defaultValue?: string;
}

export interface RichTextSchema<TContext = unknown>
  extends BaseField<TContext> {
  /**
   * A rich text field, used for rich text.
   */
  type: "richtext";

  /**
   * The default rich text value.
   */
  defaultValue?: string;
}

export interface ColorSchema<TContext = unknown> extends BaseField<TContext> {
  /**
   * A color field, used for colors.
   */
  type: "color";

  /**
   * The default color value.
   */
  defaultValue?: string;
}

export type Schema<TContext = unknown> =
  | TextSchema<TContext>
  | NumberSchema<TContext>
  | ToggleSchema<TContext>
  | ArraySchema<TContext>
  | ObjectSchema<TContext>
  | ReferenceSchema<TContext>
  | MediaSchema<TContext>
  | DateSchema<TContext>
  | DateTimeSchema<TContext>
  | DateRangeSchema<TContext>
  | EmailSchema<TContext>
  | PasswordSchema<TContext>
  | UrlSchema<TContext>
  | RichTextSchema<TContext>
  | ColorSchema<TContext>;
