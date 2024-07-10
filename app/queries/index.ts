// import { useQueries } from "@tanstack/react-query";
// import axios from "axios";


// //NOTE - query fucntions
// const getProducts = async () => {
//     try {
//       const response = await axios.get("/api/getproducts");
//       if (response.data.status) {
//         return response.data.products;
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };
// const [
//     products,
    
//   ] = useQueries({
//     queries: [
//       {
//         queryKey: ['listbusinesscontactpersons', 1],
//         queryFn: () => listBusinessContactPersons(),
//         staleTime: 5000,
//       },
     
//     ],
//   })
