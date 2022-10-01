import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

type Transactions = {
	id: string;
	title: string,
	type: string,
	value: number
}

type ApiResponse = {
	balance: {income:number,outcome: number, total: number},		
	transactions: Transactions[]
}

export default function Transactions() {
	const [data, setData] = useState<Transactions[]>([]);

	useEffect(() => {
		const userID = JSON.parse(localStorage.getItem('user-logado') as string)
		console.log(userID)
		async function getTransactions (){
			const {data}: AxiosResponse<ApiResponse> = await axios.get(`http://localhost:3333/user/${userID}/transactions`);
			console.log(data)
			setData(data.transactions)			
		}
	getTransactions()
	},[]);


	return <Box>
		<TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Titulo</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Valor</TableCell>            
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: Transactions) => (
            <TableRow key={row.id}>              
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
	</Box>


}
