export interface TaigaAuth {
  auth_token: string;
  refresh: string;
}

export interface TaigaProject {
  id: number;
  name: string;
  slug: string;
}

export interface TaigaUserStory {
  id: number;
  subject: string;
  status_extra_info: {
    name: string;
  };
  created_date: string;
  status: string;
  status_extra_info: {
    name: string;
    color: string;
  };
}

export interface TaigaComment {
  user: {
    username: string;
    full_name: string;
  };
  comment: string;
  created_at: string;
}