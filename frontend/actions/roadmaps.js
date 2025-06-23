export default async function getRoadById({ id }) {
  try {
    const res = await fetch(`${process.env.BASE_API_URL}/api/roadmaps/${id}`, {
      next: {
        revalidate: 60,
      },
    });

    const data = await res.json();

    return data.roadmap;
  } catch (error) {
    console.log("Error getting data", error.message);
    throw error;
  }
}
