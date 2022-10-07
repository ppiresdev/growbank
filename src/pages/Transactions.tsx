import {
  Box,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

type Transactions = {
  _id: string;
  _title: string;
  _type: string;
  _value: number;
  _archived: boolean;
};

type Balance = {
  income: number;
  outcome: number;
  total: number;
};

type ApiResponse = {
  balance: Balance;
  transactions: Transactions[];
};

export default function Transactions() {
  const userID = JSON.parse(localStorage.getItem("user-logado") as string);
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [hasUpdate, setHasUpdate] = useState(true);
  const [title, setTitle] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [archivedFilter, setArchivedFilter] = useState("");
  const [value, setValue] = useState(0);
  const [type, setType] = useState<"income" | "outcome">("income");
  const [balance, setBalance] = useState<Balance>({
    income: 0,
    outcome: 0,
    total: 0,
  });

  useEffect(() => {
    async function getTransactions() {
      const { data }: AxiosResponse<ApiResponse> = await axios.get(
        process.env.REACT_APP_URL + `user/${userID}/transactions`
      );
      console.log(data);
      setTransactions(data.transactions);
      setBalance(data.balance);
    }
    if (hasUpdate) {
      getTransactions();
      setHasUpdate(false);
    }
  }, [hasUpdate]);

  async function criarTransacao() {
    const transaction = {
      title,
      value,
      type,
    };
    const response: AxiosResponse<{ transactions: Transactions[] }> =
      await axios.post(
        process.env.REACT_APP_URL + `user/${userID}/transactions`,
        transaction
      );
    setHasUpdate(true);
    console.log(response.data);
  }

  return (
    <Box display="flex" flexDirection="column" gap="40px">
      <Box display="flex" flexDirection="column" gap="16px">
        <TextField
          label="Tittle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          type="number"
          label="Value"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <Select
          value={type}
          label="Type"
          onChange={(e) => setType(e.target.value as "income" | "outcome")}
        >
          <MenuItem value={"income"}>Income</MenuItem>
          <MenuItem value={"outcome"}>Outcome</MenuItem>
        </Select>
        <Button onClick={criarTransacao} variant="outlined">
          Criar Transação
        </Button>
      </Box>
      <Box>
        <TextField
          label="Title"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
        />
        <TextField
          label="Type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        />

        <TextField
          label="Archived"
          value={archivedFilter}
          onChange={(e) => setArchivedFilter(e.target.value)}
        />

        <Button
          onClick={async () => {
            let query = "";

            if (archivedFilter) {
              query += `?archived=${archivedFilter}`;
            }

            if (typeFilter) {
              query +=
                query[0] === "?"
                  ? `&type=${typeFilter}`
                  : `?type=${typeFilter}`;
            }

            if (titleFilter) {
              query +=
                query[0] === "?"
                  ? `&title=${titleFilter}`
                  : `?title=${titleFilter}`;
            }

            const { data }: AxiosResponse<ApiResponse> = await axios.get(
              process.env.REACT_APP_URL + `user/${userID}/transactions${query}`
            );
            console.log(data);

            setTransactions(data.transactions);
            setBalance(data.balance);
          }}
        >
          Buscar
        </Button>
      </Box>

      <Box
        display="flex"
        justifyContent="space-evenly"
        sx={{ backgroundColor: "red" }}
      >
        <Typography>income - R$ {balance.income},00</Typography>
        <Typography>outcome - R$ {balance.outcome},00</Typography>
        <Typography>total - R$ {balance.total},00</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Titulo</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Arquivado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((row: Transactions) => (
              <TableRow key={row._id}>
                <TableCell>{row._title}</TableCell>
                <TableCell>{row._type}</TableCell>
                <TableCell>{row._value}</TableCell>
                <TableCell>{row._archived.toString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
