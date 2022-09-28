import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import queryString from 'query-string';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

const Heading = styled.div({
  fontFamily: 'Roboto',
  fontSize: '40px',
});

type Snapshot = {
  dietries: string;
  rsvp: boolean;
  hasSubmitted: boolean;
};

function App() {
  const query = queryString.parse(location.search) as { user: string };
  const user = query.user || '';
  const [form, setForm] = useState({
    isLoading: true,
    rsvp: false,
    dietries: '',
    hasSubmitted: false,
  });

  const { isLoading, rsvp, dietries, hasSubmitted } = form;
  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `invites/${user}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const { dietries, rsvp } = snapshot.val() as Snapshot;
          setForm({ ...form, isLoading: false, dietries, rsvp });
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        setForm({ ...form, isLoading: false });
        console.error(error);
      });
  }, []);

  const handleSubmit = async () => {
    const db = getDatabase();
    await set(ref(db, `invites/${user}`), {
      rsvp,
      dietries,
    });
    await handleSubmitToggle();
  };

  const handleSubmitToggle = async () => {
    setForm({ ...form, isLoading: true });
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `invites/${user}`));
    const { hasSubmitted } = snapshot.val() as Snapshot;
    await set(child(dbRef, `invites/${user}/hasSubmitted`), !hasSubmitted);
    setForm({ ...form, hasSubmitted: !hasSubmitted, isLoading: false });
    return true;
  };

  return (
    <div className="App">
      <Container maxWidth="md">
        {hasSubmitted ? (
          <>
            <Heading>Thanks {user} for RSVPing to our wedding!</Heading>
            <Button onClick={handleSubmitToggle} variant="contained">
              Make a change
            </Button>
          </>
        ) : (
          <>
            <Heading>RSVP for {user}</Heading>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rsvp}
                    onChange={() => setForm({ ...form, rsvp: !rsvp })}
                  />
                }
                label="Coming"
              />
              <TextField
                id="outlined-basic"
                margin="dense"
                label="Any dietry requirements?"
                variant="outlined"
                value={dietries}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dietries: e.target.value,
                  })
                }
              />
              <Button onClick={handleSubmit} variant="contained">
                Submit
              </Button>
            </FormGroup>
          </>
        )}
      </Container>

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default App;
