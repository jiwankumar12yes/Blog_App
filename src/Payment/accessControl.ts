export const hasAccess = (userSubscriptionStatus: string): boolean => {
  return userSubscriptionStatus === "active";
};
