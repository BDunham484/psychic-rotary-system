// @ts-ignore
import styles from './AdminDelete.module.css';
import { Delete } from '@styled-icons/fluentui-system-filled/Delete'
import { Redo } from '@styled-icons/boxicons-regular/Redo'
import { useState } from 'react';
import { DELETE_CONCERTS } from '../../utils/mutations';
import { useMutation } from '@apollo/client';

const AdminDelete = ({ concertId, filterList }) => {
    const [isDeleteToggled, setIsDeleteToggled] = useState(false);

    const {
        adminButtons,
        redo,
        deleteCancel,
        deleteDark,
    } = styles;

    const [deleteConcert] = useMutation(DELETE_CONCERTS);

    const handleDeleteClick = async () => {
        setIsDeleteToggled((prev) => !prev);

        if (isDeleteToggled) {
            try {
                const deleted = await deleteConcert({
                    variables: {
                        concertId: concertId,
                    }
                })

                if (deleted) {
                    filterList(concertId);
                }
            } catch (err) {
                console.error(err);
            };
        }
    };

    return (
        <div id={adminButtons}>
            {isDeleteToggled &&
                <div onClick={() => setIsDeleteToggled(prev => !prev)}>
                    <Redo id={redo} />
                </div>
            }
            <div onClick={handleDeleteClick}>
                <Delete id={isDeleteToggled ? deleteCancel : deleteDark} />
            </div>
        </div>
    );
};

export default AdminDelete;
