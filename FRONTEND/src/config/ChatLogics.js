// This function takes the logged-in user and the array of 2 users in a chat,
// and returns the name of the OTHER person.
export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};