import mock from "../mock"

export const searchResult = [
  {
    groupTitle: "Pages",
    searchLimit: 4,
    data: [
      {
        id: 1,
        target: "assets",
        title: "Assets",
        link: "/",
        icon: "Home"
      },
      {
        id: 2,
        target: "top10",
        title: "Top 10",
        link: "/top10Assets",
        icon: "File"
      }
    ]
  }
]

mock.onGet("/api/main-search/data").reply(200, {
  searchResult
})
