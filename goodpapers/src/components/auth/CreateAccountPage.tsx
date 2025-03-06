import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
`;

const FormCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4285F4;
  }
`;

const Button = styled.button`
  background-color: #4285F4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3367D6;
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #ffebee;
`;

const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';

const CreateAccountPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth } = useAuth();
  
  // Extract email and name from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const nameParam = params.get('name');
    
    if (emailParam) {
      setEmail(emailParam);
    }
    
    if (nameParam) {
      setName(nameParam);
    }
  }, [location.search]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return setError('Please enter your name');
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/create-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email
        })
      });
      
      if (response.ok) {
        // Check authentication status to update context
        await checkAuth();
        navigate('/home');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container>
      <FormCard>
        <Title>Create Your Account</Title>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              readOnly
              disabled
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </FormGroup>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
      </FormCard>
    </Container>
  );
};

export default CreateAccountPage; 