import Container from '../ui/Container';
import Button from '../ui/Button';
import StatusMessage from '../StatusMessage';

/** Shows a loader or an error with "Try again" until `status` is "succeeded". */
const AsyncState = ({ status, error, retry, loadingText = 'Loading…', children }) => {
  if (status === 'loading') {
    return (
      <Container>
        <StatusMessage variant="loading" title={loadingText} />
      </Container>
    );
  }
  if (status === 'failed') {
    return (
      <Container>
        <StatusMessage
          variant="error"
          title="We couldn’t load the shop"
          text={`The server did not respond (${error}). Make sure the API is running and try again.`}
          action={<Button onClick={retry}>Try again</Button>}
        />
      </Container>
    );
  }
  return children();
};

export default AsyncState;
