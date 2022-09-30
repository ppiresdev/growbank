import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

export const Signup = () => {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<Number>(0);

  const testEmailRegex = /@/;

  const onSubmit = () => {
    const myObject = {
      name: name,
      cpf: cpf,
      email,
      age,
    };

    console.log("===BODY===", myObject);
    axios.post("http://localhost:3333/user", myObject);
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
        id="outlined-cpf"
        label="CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
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
      <TextField
        type="number"
        id="outlined-age"
        label="Age"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />
      <Button variant="outlined" onClick={onSubmit}>
        Register
      </Button>
    </Box>
  );
};
