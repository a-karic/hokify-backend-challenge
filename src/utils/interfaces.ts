export type IUpdateObjectInputValue  = string | number | null | undefined | Record<string, unknown>;
export type IUpdateObjectInput = Record<string, IUpdateObjectInputValue>;
export type IId = string | number;
export type ICustomObjectValue = string | number | ICustomObject | ICustomObjectWithID[] | undefined;

export interface ICustomObject {
    [x: string]: ICustomObjectValue;
}

export interface ICustomObjectWithID extends ICustomObject {
    "_id"?: IId;
}