import { createContext, useEffect, useState } from "react";
import { getDeliveryPartnerProfile } from "../services/deliveryPortalService";

export const DeliveryAuthContext = createContext();

export function DeliveryAuthProvider({ children }) {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("delivery_token");

    if (token) {
      getDeliveryPartnerProfile()
        .then((data) => {
          setPartner(data);
        })
        .catch(() => {
          localStorage.removeItem("delivery_token");
          localStorage.removeItem("delivery_partner");
          setPartner(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, partnerData) => {
    localStorage.setItem("delivery_token", token);
    localStorage.setItem("delivery_partner", JSON.stringify(partnerData));
    setPartner(partnerData);
  };

  const logout = () => {
    localStorage.removeItem("delivery_token");
    localStorage.removeItem("delivery_partner");
    setPartner(null);
  };

  const updatePartnerState = (updated) => {
    setPartner((prev) => ({ ...prev, ...updated }));
  };

  return (
    <DeliveryAuthContext.Provider
      value={{
        partner,
        loading,
        login,
        logout,
        updatePartnerState,
      }}
    >
      {children}
    </DeliveryAuthContext.Provider>
  );
}
