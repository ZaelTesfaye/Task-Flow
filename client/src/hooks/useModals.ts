import { useState } from "react";
import { DEFAULT_MODAL_STATE, DEFAULT_FORM_STATE } from "@/constants";

export const useProjectModals = () => {
  const [activePane, setActivePane] = useState<"members" | "settings" | null>(null);
  const [modals, setModals] = useState(DEFAULT_MODAL_STATE);
  const [forms, setForms] = useState(DEFAULT_FORM_STATE);

  const isMembersPaneOpen = activePane === "members";
  const isSettingsPaneOpen = activePane === "settings";

  const setIsMembersPaneOpen = (open: boolean) => {
    setActivePane(open ? "members" : null);
  };

  const setIsSettingsPaneOpen = (open: boolean) => {
    setActivePane(open ? "settings" : null);
  };

  const openModal = (key: keyof typeof DEFAULT_MODAL_STATE) => {
    setModals((prev) => ({ ...prev, [key]: true }));
  };

  const closeModal = (key: keyof typeof DEFAULT_MODAL_STATE) => {
    setModals((prev) => ({ ...prev, [key]: false }));
  };

  const updateForm = (key: keyof typeof DEFAULT_FORM_STATE, value: any) => {
    setForms((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = (key: keyof typeof DEFAULT_FORM_STATE) => {
    setForms((prev) => ({ ...prev, [key]: DEFAULT_FORM_STATE[key] }));
  };

  return {
    isMembersPaneOpen,
    setIsMembersPaneOpen,
    isSettingsPaneOpen,
    setIsSettingsPaneOpen,
    modals,
    forms,
    openModal,
    closeModal,
    updateForm,
    resetForm,
  };
};
