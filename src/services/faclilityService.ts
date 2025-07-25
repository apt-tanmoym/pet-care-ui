import http from '@/common/http';
import { FaclityServicePayload, FaclityServiceResponse, GetFacilityDetailsPayload, AddNewFacilityPayload } from '@/interfaces/facilityInterface';

export const getOwnFacilites = async (payload: FaclityServicePayload): Promise<FaclityServiceResponse[]> => {
  try {
    const { data } = await http.post<FaclityServiceResponse[]>('/getownfacility', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getFacilityDetails = async (payload: GetFacilityDetailsPayload): Promise<any> => {
  try {
    const { data } = await http.post('/getfacilitydetails', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const addNewFacility = async (payload: FaclityServiceResponse): Promise<any> => {
  try {
    const { data } = await http.post('/addnewfacility', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getCityList = async (searchText: string): Promise<any[]> => {
  try {
    const { data } = await http.post('/getcitylist', { searchText });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAreaListSearchText = async (cityId: string, searchText: string): Promise<any[]> => {
  try {
    const { data } = await http.post('/getarealistsearchtext', { cityId, searchText });
    return data;
  } catch (error) {
    throw error;
  }
};
