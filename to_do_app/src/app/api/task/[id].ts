import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { title, description, duedate, status } = req.body;
    try {
      const updatedTask = await db.task.update({
        where: { id: id as string },
        data: {
          title,
          description,
          duedate: new Date(duedate),
          status,
        },
      });
      res.status(200).json(updatedTask);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error updating task" });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletedTask = await db.task.delete({
        where: { id: id as string },
      });
      res.status(200).json(deletedTask);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error deleting task" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
