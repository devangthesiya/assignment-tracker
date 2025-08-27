// Pool of fun usernames for different browser sessions
const USER_POOL = [
  {
    id: "user_001",
    username: "CoffeeLover42",
    avatar:
      "https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
  },
  {
    id: "user_002",
    username: "PixelNinja",
    avatar:
      "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
  },
  {
    id: "user_003",
    username: "SunflowerDream",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
  },
  {
    id: "user_004",
    username: "MidnightCoder",
    avatar:
      "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
  },
  {
    id: "user_005",
    username: "BubbleWrap99",
    avatar:
      "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
  },
  {
    id: "user_006",
    username: "WanderlustSoul",
    avatar:
      "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
  },
  {
    id: "user_007",
    username: "NeonVibez",
    avatar:
      "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
  },
  {
    id: "user_008",
    username: "CloudHopper",
    avatar:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
  },
  {
    id: "user_009",
    username: "StarGazer21",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
  },
  {
    id: "user_010",
    username: "RetroWave88",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
  },
];

export interface User {
  id: string;
  username: string;
  avatar: string;
}

// Generate a session ID for this browser session
const generateSessionId = (): string => {
  const existing = sessionStorage.getItem("sociogram_session_id");
  if (existing) return existing;

  const sessionId = `session_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  sessionStorage.setItem("sociogram_session_id", sessionId);
  return sessionId;
};

// Get or assign a user for this session
export const getCurrentUser = (): User => {
  const sessionId = generateSessionId();

  // Check if user is already assigned to this session
  const savedUserId = sessionStorage.getItem("sociogram_user_id");
  if (savedUserId) {
    const user = USER_POOL.find((u) => u.id === savedUserId);
    if (user) return user;
  }

  // Get list of already assigned users from localStorage
  const assignedUsers = JSON.parse(
    localStorage.getItem("sociogram_assigned_users") || "{}"
  );

  // Find an available user (not assigned to any active session)
  let availableUser = USER_POOL.find(
    (user) => !Object.values(assignedUsers).includes(user.id)
  );

  // If all users are taken, just pick a random one (allows multiple sessions with same user)
  if (!availableUser) {
    availableUser = USER_POOL[Math.floor(Math.random() * USER_POOL.length)];
  }

  // Assign this user to the current session
  assignedUsers[sessionId] = availableUser.id;
  localStorage.setItem(
    "sociogram_assigned_users",
    JSON.stringify(assignedUsers)
  );
  sessionStorage.setItem("sociogram_user_id", availableUser.id);

  return availableUser;
};

// Clean up old sessions (call this periodically)
export const cleanupOldSessions = (): void => {
  const assignedUsers = JSON.parse(
    localStorage.getItem("sociogram_assigned_users") || "{}"
  );
  const currentSessionId = generateSessionId();

  // Keep only the current session and a few recent ones
  const sessionIds = Object.keys(assignedUsers);
  if (sessionIds.length > 5) {
    // Keep only the 3 most recent sessions plus current
    const recentSessions = sessionIds.slice(-3);
    if (!recentSessions.includes(currentSessionId)) {
      recentSessions.push(currentSessionId);
    }

    const cleanedUsers: { [key: string]: string } = {};
    recentSessions.forEach((sessionId) => {
      if (assignedUsers[sessionId]) {
        cleanedUsers[sessionId] = assignedUsers[sessionId];
      }
    });

    localStorage.setItem(
      "sociogram_assigned_users",
      JSON.stringify(cleanedUsers)
    );
  }
};

// Get all users for display purposes
export const getAllUsers = (): User[] => {
  return [...USER_POOL];
};
