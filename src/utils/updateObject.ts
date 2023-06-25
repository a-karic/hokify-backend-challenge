export type IUpdateObjectInput = Record<string, string | number | null | undefined | Record<string, unknown>>;

export interface CustomObject {
    [x: string]: string | number | CustomObject | CustomObjectWithID[];
}

export interface CustomObjectWithID extends CustomObject {
    "_id": string | number;
}

export const updateObject = (object: CustomObject, input: IUpdateObjectInput): CustomObject => {

    return object;
};