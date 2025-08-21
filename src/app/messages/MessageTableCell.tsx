import AppModal from "@/components/AppModal";
import PresenceAvatar from "@/components/PresenceAvatar";
import { truncateString } from "@/lib/util";
import { MessageDto } from "@/types";
import { Button, ButtonProps } from "@heroui/button";
import { useDisclosure } from "@heroui/react";
import { AiFillDelete } from "react-icons/ai";

type Props = {
  item: MessageDto;
  columnKey: string;
  isOutbox: boolean;
  deleteMessage: (message: MessageDto) => void;
  isDeleting: boolean;
}

export default function MessageTableCell({item, columnKey, isOutbox, deleteMessage, isDeleting} : Props) {
  const cellValue = item[columnKey as keyof MessageDto];
  const {isOpen, onOpen, onClose} = useDisclosure();

  const onConfirmDeleteMessage = () => {
    deleteMessage(item)
  }

  const footerButtons: ButtonProps[] = [
    {color: 'default', onPress: onClose, children: 'Cancel'},
    {color: 'secondary', onPress: onConfirmDeleteMessage, children: 'Confirm'},
  ];


  switch (columnKey) {
    case 'recipientName':
    case 'senderName':
      return (
        <div className='flex items-center gap-2 cursor-pointer'>
          <PresenceAvatar
            src={isOutbox ? item.recipientImage : item.senderImage}
            userId={isOutbox ? item.recipientId : item.senderId}
          />
          <span>{cellValue}</span>
        </div>
      )
    case 'text' :
      return (
        <div className="truncate">
          {truncateString(cellValue, 80)}
        </div>
      )
    case 'created' :
      return <div>{cellValue}</div>    
    default:
      return (
        <>
          <Button 
            isIconOnly variant="light"
            onPress={() => onOpen()}
            isLoading= {isDeleting}
          >
            <AiFillDelete size={24} className="text-danger"/>
          </Button>
          <AppModal 
            isOpen={isOpen} 
            onClose={onClose} 
            header={"Please confirm this action"} 
            body={<div>Are you sure you want to delete this message? This cannot be undone.</div>} 
            footerButtons={footerButtons} 
          />
        </>

      );
  }
}