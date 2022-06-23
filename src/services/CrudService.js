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

  static async update(model, id, data) {
    const item = doc(db, model, id);
    try {
      await updateDoc(item, { ...data, updatedAt: Timestamp.now() });
      return true;
    } catch (err) {
      return err;
    }
  }

  static async delete(model, id) {
    const item = doc(db, model, id);
    try {
      await deleteDoc(item);
      return true;
    } catch (err) {
      return err;
    }
  }

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
}

export default CrudService;
