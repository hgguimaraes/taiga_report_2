import axios from 'axios';
import { TaigaAuth, TaigaProject, TaigaUserStory, TaigaComment } from '../types/taiga';

const API_URL = 'https://api.taiga.io/api/v1';
const USERNAME = 'hg_guimaraes';
const PASSWORD = '051283Hsg@';

let authToken = '';

// Configure axios defaults
axios.defaults.timeout = 10000; // 10 second timeout
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const authenticate = async (): Promise<void> => {
  try {
    const response = await axios.post<TaigaAuth>(`${API_URL}/auth`, {
      type: 'normal',
      username: USERNAME,
      password: PASSWORD
    });
    
    if (!response.data.auth_token) {
      throw new Error('Token de autenticação não recebido');
    }
    
    authToken = response.data.auth_token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  } catch (error: any) {
    console.error('Erro de autenticação:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.detail || 
      'Falha na autenticação com o Taiga. Verifique suas credenciais.'
    );
  }
};

export const getUserStories = async (projectSlug: string): Promise<TaigaUserStory[]> => {
  try {
    if (!authToken) {
      await authenticate();
    }
    
    // First, get the project by slug
    const projectResponse = await axios.get(`${API_URL}/projects/by_slug?slug=${projectSlug}`);
    
    if (!projectResponse.data?.id) {
      throw new Error('Projeto não encontrado');
    }
    
    const projectId = projectResponse.data.id;
    
    // Then get the user stories using the project ID
    const storiesResponse = await axios.get(`${API_URL}/userstories?project=${projectId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    return storiesResponse.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Projeto não encontrado. Verifique a URL do projeto.');
    }
    if (error.response?.status === 401) {
      // Try to reauthenticate once
      authToken = '';
      await authenticate();
      return getUserStories(projectSlug);
    }
    console.error('Erro ao buscar histórias:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.detail || 
      'Falha ao buscar histórias de usuário. Verifique se o projeto existe.'
    );
  }
};

export const getComments = async (userStoryId: number): Promise<TaigaComment[]> => {
  try {
    if (!authToken) {
      await authenticate();
    }
    
    const response = await axios.get(`${API_URL}/history/userstory/${userStoryId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    return response.data
      .filter((item: any) => item.comment && item.comment.length > 0)
      .map((item: any) => ({
        user: {
          username: item.user.username,
          full_name: item.user.full_name || item.user.username
        },
        comment: item.comment,
        created_at: item.created_at
      }));
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Try to reauthenticate once
      authToken = '';
      await authenticate();
      return getComments(userStoryId);
    }
    console.error('Erro ao buscar comentários:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.detail || 
      'Falha ao buscar comentários. Tente novamente mais tarde.'
    );
  }
};