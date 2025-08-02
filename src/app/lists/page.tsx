import { fetchCurrentUserLikeIds, fetchLikedMembers } from "../actions/likeActions"
import ListsTab from "./ListsTab";

export default async function ListsPage({searchParams}
  : {searchParams: Promise<{type: string}>}) {
  const {type} = await searchParams;

  const likeIds = await fetchCurrentUserLikeIds();
  const members = await fetchLikedMembers(type);

  return (
    <ListsTab members={members} likeIds={likeIds}/>
  )
}