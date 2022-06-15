import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json';
import { AuthContext } from '../providers/auth';

function Titulo(props) {
  const Tag = props.tag || 'h1';
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals['000']};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

export default function PaginaInicial() {
  const {user, setUser } = useContext(AuthContext);
  const roteamento = useRouter();

  function handleChange(e) {
    setUser(e.target.value.trim());
  }

  function handleClick(e) {
    e.preventDefault
    localStorage.setItem('user', user);
  }

  return (
    <>
      <Box
        styleSheet={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: appConfig.theme.colors.gradient['linear'],
          backgroundSize: '400% 400%',
          animation: 'gradient 30s ease infinite',
        }}>
        <Box
          styleSheet={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            width: '100%',
            maxWidth: '700px',
            borderRadius: '5px',
            padding: '32px',
            margin: '16px',
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            backgroundColor: appConfig.theme.colors.neutrals[700],
          }}>

          {/* Form */}
          <Box
            as='form'
            onSubmit={function (e) {
              e.preventDefault();
              roteamento.push('/chat');
            }}
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: '100%', sm: '50%' },
              textAlign: 'center',
              marginBottom: '32px',
            }}>
            <Titulo tag='h2'>Real time chat</Titulo>
            <Text
              variant='body3'
              styleSheet={{
                marginBottom: '32px',
                color: appConfig.theme.colors.neutrals[300],
              }}>
              (insert a Github username and enjoy)
            </Text>

            <TextField
              value={user}
              onChange={(e) => handleChange(e)}
              minLength='3'
              fullWidth
              required
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />
            <Button
              type='submit'
              label='Entrar'
              onClick={(e) => handleClick(e)}
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals['000'],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Form */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '200px',
              padding: '16px',
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: '1px solid',
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: '10px',
              flex: 1,
              minHeight: '240px',
            }}>
            <Image
              styleSheet={{
                borderRadius: '50%',
                marginBottom: '16px',
              }}
              src={
                `${user}`.length > 2
                  ? `https://github.com/${user}.png`
                  : null
              }
            />
            <Text
              variant='body4'
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px',
              }}>
              {`${user}`.length > 2 ? `${user}` : null}
            </Text>
          </Box>
          {/* Photo Area */}
          
        </Box>
      </Box>
    </>
  );
}
