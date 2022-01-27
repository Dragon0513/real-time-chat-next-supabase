import { Box,Text, TextField, Image, Button, Icon } from "@skynexui/components";
import { useState } from "react";
import appConfig from "../config.json";

export default function ChatPage() {
  const [mensagem, setMensagem] = useState("");
  const [listaDeMensagens, setListaDeMensagens] = useState([]);
  const [ID, setID] = useState(0);

  function handleNovaMensagem(novaMensagem) {
    setID(ID+1);
    const mensagem = {
      id: ID,
      de: "vanessametonini",
      texto: novaMensagem,
    };
    novaMensagem && (setListaDeMensagens([mensagem, ...listaDeMensagens]), setMensagem(""));
  }

  function handleChange(e) {
    const valor = e.target.value;
    setMensagem(valor);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNovaMensagem(mensagem);
    }
  }

  function handleClick(e) {
    e.preventDefault();
    handleNovaMensagem(mensagem);
  }

  function handleDelete(id){
    const filteredMessages = listaDeMensagens.filter(mensagem => mensagem.id !== id);
    setListaDeMensagens(filteredMessages);
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: appConfig.theme.colors.gradient['linear'],
        backgroundSize: '400% 400%',
        animation: 'gradient 30s ease infinite',
        color: appConfig.theme.colors.neutrals["000"]
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList mensagens={listaDeMensagens} handleDelete={handleDelete} />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              colorVariant="light"
              iconName="arrowRight"
              type="submit"
              variant="secondary"
              onClick={handleClick}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList({mensagens, handleDelete}) {

  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                display: "flex", 
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
                <Box>
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/vanessametonini.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString("pt-BR")}
                {new Date().toLocaleTimeString("pt-BR")}
              </Text>
              </Box>
              
              <Icon
                label="Icon Component"
                name="FaTrashAlt"
                size="1.2ch"
                styleSheet={{
                  color: "#fff",
                  margin: "5px",
                  cursor: "pointer"
                }}
                onClick={()=>handleDelete(mensagem.id)}
              />
            </Box>
            {mensagem.texto}
          </Text>
        );
      })}
    </Box>
  );
}
