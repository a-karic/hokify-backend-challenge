import { ICustomObject } from "../utils/interfaces";
import { get, loadAll, save, update, deleteObject } from "./../tools/firebase";

export interface IObjectRecord {
  id: string;
  data: ICustomObject;
}

  // Define a property to store the collection name
const collectionName = "objects";

class ObjectService {

  // Define a method to get a document by its id using the get function from firebase.ts
  async get(id: string) {
    return await get(id, collectionName);
  }

  // Define a method to load all documents from firebase.ts
  async loadAll(): Promise<IObjectRecord[]> {
    const objects = await loadAll(collectionName);
    const result: IObjectRecord[] = [];

    objects.forEach(object => {
      const { id, ...data} = object;
      result.push({ id, data });
    });

    return result;
  }

  // Define a method to save a document with a given id and data using the save function from firebase.ts
  async save(id: string, data: any) {
    return await save(id, data, collectionName);
  }

  // Define a method to update a document with a given id and data using the update function from firebase.ts
  async update(id: string, data: any) {
    return await update(id, data, collectionName);
  }

  // Define a method to delete a document by its id using the delete function from firebase.ts
  async delete(id: string) {
    return await deleteObject(id, collectionName);
  }
}

export const objectService = new ObjectService();
