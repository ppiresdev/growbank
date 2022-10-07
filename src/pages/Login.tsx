import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  console.log("===Process env===", process.env.REACT_APP_URL);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const testEmailRegex = /@/;

  const onSubmit = async () => {
    const myObject = {
      name: name,
      email,
    };

    console.log("===BODY===", myObject);
    const {
      data,
    }: AxiosResponse<
      {
        name: string;
        cpf: string;
        email: string;
        age: number;
        id: string;
      }[]
    > = await axios.get(process.env.REACT_APP_URL + "user");
    console.log(data);
    const userFound = data.find(
      (user) => user.name === myObject.name && user.email === myObject.email
    );

    if (!userFound) {
      return alert("Usuario não encontrado!");
    }

    localStorage.setItem("user-logado", JSON.stringify(userFound.id));
    alert("Deu certo");
    navigate("/transactions");
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} padding="40px">
      <TextField
        id="outlined-name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        id="outlined-email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!testEmailRegex.test(email)}
        helperText={
          !testEmailRegex.test(email) ? "Digite um e-mail válido" : ""
        }
      />
      <Button variant="outlined" onClick={onSubmit}>
        Logar
      </Button>
    </Box>
  );
};
