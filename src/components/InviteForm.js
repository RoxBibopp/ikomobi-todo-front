import React, { useState } from 'react';
import { fetchApi } from '../services/api';

const InviteForm = ({ boardId, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchApi(`/boards/${boardId}/invite`, {
        method: 'POST',
        body: { email }
      });
      setMessage(res.message);
      setError(null);
      setEmail('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
      setMessage(null);
    }
  };

  return (
    <>
    <form onSubmit={handleInvite}>
      <div>
        <label>Inviter par email :</label>
        <br />
        <input
          type="email"
          className="inputComponent inputText"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
    {message && <p style={{ color: 'green' }}>{message}</p>}
    {error && <p style={{ color: 'red' }}>{error}</p>}
      <button className="button" type="submit">
        Envoyer l'invitation
      </button>
    </form>
  </>
)};

export default InviteForm;
