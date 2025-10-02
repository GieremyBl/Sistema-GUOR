import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const popularProducts = [
  {
    id: 1,
    name: "Camisa Casual",
    price: "29.99",
    images: {
      main: "/products/1g.png"
    }
  },
  {
    id: 2,
    name: "Pantalón Clásico",
    price: "49.99",
    images: {
      main: "/products/2g.png"
    }
  },
  {
    id: 3,
    name: "Vestido Elegante",
    price: "79.99",
    images: {
      main: "/products/3b.png"
    }
  }
];

const latestTransactions = [
  {
    id: 1,
    title: "Pedido #1234",
    amount: 299.99,
    status: "completed",
    date: "2025-10-02",
    image: "/products/4w.png"
  },
  {
    id: 2,
    title: "Pedido #1235",
    amount: 199.99,
    status: "pending",
    date: "2025-10-02",
    image: "/products/5o.png"
  },
  {
    id: 3,
    title: "Pedido #1236",
    amount: 499.99,
    status: "processing",
    date: "2025-10-02",
    image: "/products/6g.png"
  }
];

const CardList = ({ title }: { title: string }) => {
  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {title === "Popular Products"
          ? popularProducts.map((item) => (
              <Card
                key={item.id}
                className="flex-row items-center justify-between gap-4 p-4"
              >
                <div className="w-12 h-12 rounded-sm relative overflow-hidden">
                  <Image
                    src={Object.values(item.images)[0] || ""}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">
                    {item.name}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-0">${item.price}K</CardFooter>
              </Card>
            ))
          : latestTransactions.map((item) => (
              <Card
                key={item.id}
                className="flex-row items-center justify-between gap-4 p-4"
              >
                <div className="w-12 h-12 rounded-sm relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">
                    {item.title}
                  </CardTitle>
                  <Badge variant="secondary">{item.status}</Badge>
                </CardContent>
                <CardFooter className="p-0">${item.amount}</CardFooter>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default CardList;
