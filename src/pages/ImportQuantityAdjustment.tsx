import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ImportQuantityAdjustment() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard/inventory/quantity-adjustments", { replace: true });
  }, [navigate]);

  return null;
}