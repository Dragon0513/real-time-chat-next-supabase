import { Box, Text, TextField, Image, Button, Icon, } from '@skynexui/components';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../providers/auth';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_API_ENDPOINT;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function realTimeMessage(addMessage) {
  return supabaseClient
    .from('mensagens')
    .on('INSERT', (data) => {
      addMessage(data.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const [mensagem, setMensagem] = useState('');
  const [listaDeMensagens, setListaDeMensagens] = useState([]);
  const {user, setUser} = useContext(AuthContext);
  const roteamento = useRouter();

  useEffect(()=>{
    setUser(localStorage.getItem('user'));
  },[user])
  
  useEffect(() => {
    // setUser(window.localStorage.getItem('user'));
    
    // const isLogged = Boolean(user);
    // console.log('user ', user);
    // console.log('is logged ', isLogged);
    // !user ? roteamento.push('/') :

    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setListaDeMensagens(data);
      });

    realTimeMessage((newMessage) => {
      setListaDeMensagens((currentList) => [newMessage, ...currentList]);
    });
  }, [listaDeMensagens]);

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: user,
      texto: novaMensagem,
      created_at: `${new Date().toLocaleDateString(
        'pt-BR'
      )} - ${new Date().toLocaleTimeString('pt-BR')}`,
    };

    novaMensagem &&
      (supabaseClient.from('mensagens').insert([mensagem]).then(),
      setMensagem(''));
  }

  function handleChange(e) {
    const valor = e.target.value;
    setMensagem(valor);
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNovaMensagem(mensagem);
    }
  }

  function handleClick(e) {
    e.preventDefault();
    handleNovaMensagem(mensagem);
  }

  function handleDelete(id, de) {
    user === de &&
      supabaseClient
        .from('mensagens')
        .delete()
        .match({ id: id })
        .then(() => {
          const filteredMessages = listaDeMensagens.filter(
            (data) => data.id !== id
          );
          setListaDeMensagens(filteredMessages);
          supabaseClient.from('mensagens').delete({id: id}).then();
        });
  }

  supabaseClient
    .from('mensagens')
    .on('DELETE', ({ old }) => {
      console.log('Change received!', old.id);
      const filteredMessages = listaDeMensagens.filter( (data) => data.id !== old.id );
      setListaDeMensagens(filteredMessages);
    })
    .subscribe();

  return (
    <Box
      styleSheet={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: appConfig.theme.colors.gradient['linear'],
        backgroundSize: '400% 400%',
        animation: 'gradient 30s ease infinite',
        color: appConfig.theme.colors.neutrals['000'],
      }}>
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '55%',
          minWidth: '30rem',
          maxHeight: '95vh',
          padding: '32px',
        }}>
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}>
          <MessageList
            mensagens={listaDeMensagens}
            handleDelete={handleDelete}
          />

          <Box
            as='form'
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
            }}>
            <TextField
              value={mensagem}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder='Insira sua mensagem aqui...'
              type='textarea'
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              colorVariant='light'
              iconName='arrowRight'
              type='submit'
              variant='secondary'
              onClick={handleClick}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  const { user } = useContext(AuthContext);

  function handleLogout() {
    localStorage.removeItem('user');
    setUser('');
  }

  return (
    <>
      <Box
        styleSheet={{
          width: '100%',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Box
          styleSheet={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <Text variant='heading5'>Chat - </Text>
          <Image
            styleSheet={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'inline-block',
              margin: '0 10px',
            }}
            src={`https://github.com/${user}.png`}
          />
          <Text variant='heading5'>{user}</Text>
        </Box>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href='/'
          onClick={handleLogout}
        />
      </Box>
    </>
  );
}

function MessageList({ mensagens, handleDelete }) {
  const { user } = useContext(AuthContext);

  return (
    <Box
      tag='ul'
      styleSheet={{
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals['000'],
        marginBottom: '16px',
      }}>
      {mensagens.map((mensagem) => {
        const display = user === mensagem.de ? 'flex' : 'none';

        return (
          <Text
            key={mensagem.id}
            tag='li'
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}>
            <Box
              styleSheet={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}>
              <Box>
                <Image
                  styleSheet={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'inline-block',
                    marginRight: '8px',
                  }}
                  src={`https://github.com/${mensagem.de}.png`}
                />
                <Text tag='strong'>{mensagem.de}</Text>
                <Text
                  styleSheet={{
                    fontSize: '10px',
                    marginLeft: '8px',
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag='span'>
                  {mensagem.created_at}
                </Text>
              </Box>

              <Icon
                label='Icon Component'
                name='FaTrashAlt'
                size='1.2ch'
                styleSheet={{
                  display: display,
                  color: '#fff',
                  margin: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => handleDelete(mensagem.id, mensagem.de)}
              />
            </Box>
            {mensagem.texto}
          </Text>
        );
      })}
    </Box>
  );
}
