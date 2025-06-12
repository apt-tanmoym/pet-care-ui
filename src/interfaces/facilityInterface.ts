export interface FaclityServicePayload {
    userName:string;
    userPass:string;
    deviceStat:string;
    callingFrom:string;
    searchFacility: string;
    status: string;
    orgId:string;
  }
  
  export interface FaclityServiceResponse {
      color: string;
      patientsToView: number;
      internBilling: number;
      activeInd: number;
      facilityId: number;
      orgId: number;
      cityPincodeMappingId: number;
      cityId: number;
      fees: number;
      facilityName: string;
      contactPersonName: string | null;
      address1: string;
      address2: string;
      searcharea: string | null;
      pin: string;
      state: string;
      country: string;
      firstContactNo: string;
      firstContactEmail: string;
      secondContactNo: string | null;
      secondContactEmail: string | null;
      city: string | null;
      userName: string | null;
      userPass: string | null;
      deviceStat: string | null;
      mode: string | null;
      orgName: string | null;
      areaName: string | null;
      toDayDate: string | null;
      searchFacility: string | null;
      status: string | null;
      facilityType: string;
      callingFrom: string | null;
    }