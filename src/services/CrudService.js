import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

class CrudService {
  /**
   * Get all entries from a collection
   * @param {String} model - The model to get the data from
   * @returns {Array} - An array of objects with the data from the model
   */
  static async getAll(model) {
    const entries = [];

    const querySnapshot = await getDocs(collection(db, model));
    querySnapshot.forEach((element) => {
      const data = element.data();
      data.id = element.id;

      entries.push(data);
    });

    return entries;
  }

  /**
   * Get a single entry from a collection
   * @param {String} model - The model to get the data from
   * @param {String} id - The id of the entry to get
   * @returns {Object} - An object with the data from the model
   */
  static async save(model, data) {
    try {
      await addDoc(collection(db, model), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return true;
    } catch (err) {
      return err;
    }
  }

  /**
   * Update a single entry from a collection
   * @param {String} model - The model to get the data from
   * @param {String} id - The id of the entry to update
   * @param {Object} data - The data to update the entry with
   * @returns {Object} - An object with the data from the model
   */
  static async update(model, id, data) {
    const item = doc(db, model, id);
    try {
      await updateDoc(item, { ...data, updatedAt: Timestamp.now() });
      return true;
    } catch (err) {
      return err;
    }
  }

  /**
   * Get a single entry from a collection
   * @param {String} model - The model to get the data from
   * @param {String} id - The id of the entry to get
   * @returns {Object} - An object with the data from the model
   */
  static async getById(model, id) {
    let entries = {};

    const querySnapshot = await getDocs(collection(db, model));
    querySnapshot.forEach((element) => {
      if (element.id === id) {
        const data = element.data();
        data.id = element.id;
        entries = { ...data };
      }
    });
    return entries;
  }

  /**
   * Delete a single entry from a collection
   * @param {String} model - The model to get the data from
   * @param {String} id - The id of the entry to delete
   * @returns {Object} - An object with the data from the model
   */
  static async delete(model, id) {
    const item = doc(db, model, id);
    try {
      await deleteDoc(item);
      return true;
    } catch (err) {
      return err;
    }
  }
}

export default CrudService;
