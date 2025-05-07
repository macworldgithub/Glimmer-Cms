import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import All_Salons_Recommemded_Products from "./All_Salons_Recommemded_Products";
import Recommemded_Products from "./Recommemded_Products";

const RecommendedProductsRouter = () => {
  const role = useSelector((state: RootState) => state.Login.role);
  const salonId = useSelector((state: RootState) => state.Login._id);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "salon" && salonId) {
      navigate(`/Recommemded_Products?salonId=${salonId}`, { replace: true });
    }
  }, [role, salonId, navigate]);

  if (role === "super_admin") {
    return <Recommemded_Products />;
  }
  if (role === "salon") {
    return <Recommemded_Products />;
  }

  // You can return a fallback loader or nothing
  return null;
};

export default RecommendedProductsRouter;
