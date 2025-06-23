export default async function getRoadmaps({ filter, sort }) {
  const params = new URLSearchParams();
  filter.forEach((f) => params.append("filter", f));
  sort.forEach((s) => params.append("sort", s));

  try {
    const res = await fetch(
      `${process.env.BASE_API_URL}/api/roadmaps?${params.toString()}`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    return res.json();
  } catch (error) {
    throw error;
  }
}
