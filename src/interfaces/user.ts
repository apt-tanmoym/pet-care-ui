export interface User {
    orgUserId: number;
    userNameWithTitle?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    cellNumber?: string;
    imageFilePath?: string;
    activeInd: number;
    isDoctor: number;
    userTitle?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    areaName?: string;
    country?: string;
    state?: string;
    pin?: string;
    userName?: string;
    userUid?: number;
    specialty?: string;
    orgUserQlfn?: string;
    councilId?: string;
    yearOfReg?: number;
    roleName?: string;
    profileDetails?: string;
  }