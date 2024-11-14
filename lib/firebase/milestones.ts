import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const updateMilestone = async (id: string, data: Partial<any>) => {
  const milestoneRef = doc(db, "milestones", id);
  await updateDoc(milestoneRef, data);
};