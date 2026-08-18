import { Timestamp } from "firebase/firestore";

// ─────────────────────────────────────────────
// USER  → users/{uid}
// ─────────────────────────────────────────────
export interface AppUser {
  uid: string;
  name: string;
  role: "user" | "admin";
  avatarUrl: string;
  createdAt: Timestamp;
  /**
   * Points to the currently selected Profile.
   * Single source of truth for "which profile is active".
   */
  activeProfileId: string | null;
}

// ─────────────────────────────────────────────
// PROFILE → users/{uid}/profiles/{profileId}
// A user can have MANY profiles, but each profile
// is a distinct "storefront" identity.
// ─────────────────────────────────────────────
export interface Profile {
  id: string;
  ownerUid: string;
  name: string;
  avatarUrl: string;
  location: string;
  /**
   * NOT auto-generated — the user types this in manually,
   * e.g. "Joined March 2021"
   */
  whenJoined: string;
  /**
   * The domain used to build linkUrl, e.g. "myshop.com"
   * or a subpath like "app.com/myshop"
   */
  domain: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// A lightweight snapshot of a Profile, frozen onto a Link
// at the moment the link is created, so future profile edits
// don't retroactively change historical links.
export interface ProfileSnapshot {
  id: string;
  name: string;
  avatarUrl: string;
  location: string;
  whenJoined: string;
  domain: string;
}

// ─────────────────────────────────────────────
// LINK → users/{uid}/links/{linkId}
// ─────────────────────────────────────────────
export interface Link {
  id: string;
  ownerUid: string;

  productName: string;
  /** Multiple product images (UploadThing URLs) */
  productPictures: string[];
  productAmount: number;

  sellerAvatar: string;
  sellerName: string;

  buyerPayment: number;

  /** Auto-generated, e.g. "#OU-48213907" */
  order: string;

  /** profile.domain + "/" + linkId */
  linkUrl: string;

  /** Snapshot of whichever profile was active when this link was made */
  activeProfile: ProfileSnapshot;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateProfileInput = Pick<
  Profile,
  "name" | "avatarUrl" | "location" | "whenJoined" | "domain"
>;

export type CreateLinkInput = Pick<
  Link,
  | "productName"
  | "productPictures"
  | "productAmount"
  | "sellerAvatar"
  | "sellerName"
  | "buyerPayment"
>;
