import http from '@/common/http';

export const getLoyalityDiscount = async (payload: GetAllDiscountDetailsPayload): Promise<DiscountDetails> => {
  try {
    const { data } = await http.post<DiscountDetails>('/getalldiscountdetails', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const postLoyalityDiscount = async (payload: any): Promise<DiscountDetails> => {
  try {
    const { data } = await http.post<any>('/saveseniorcitizendiscountConfig', payload);
    return data;
  } catch (error) {
    throw error;
  }
};