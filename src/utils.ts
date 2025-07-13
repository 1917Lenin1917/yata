interface IUserLike {
  firstName: string;
  lastName: string;
}

export const formatUser = (user: IUserLike): string => {
  return `${user.firstName} ${user.lastName}`;
};

export const getInitials = (user: IUserLike): string => {
  return `${user.firstName[0]}${user.lastName[0]}`;
};
export const formatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
  day: "numeric",
  month: "numeric",
  year: "numeric",
});
