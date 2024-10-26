import { Delete } from '@styled-icons/fluentui-system-filled/Delete'
import { Redo } from '@styled-icons/boxicons-regular/Redo'
import { useState } from 'react';
import { DELETE_CONCERTS } from '../../utils/mutations';
import { useMutation } from '@apollo/client';

const AdminDelete = ({ concertId, filterList }) => {
    const [isDeleteToggled, setIsDeleteToggled] = useState(false);

    const [deleteConcert] = useMutation(DELETE_CONCERTS);

    const handleDeleteClick = async () => {
        setIsDeleteToggled((prev) => !prev)

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
        <div id='admin-buttons'>
            {isDeleteToggled &&
                <div onClick={() => setIsDeleteToggled(prev => !prev)}>
                    <Redo style={{ width: '50px' }} />
                </div>
            }
            <div onClick={handleDeleteClick}>
                <Delete style={{ width: '50px', color: isDeleteToggled ? 'var(--cancel)' : 'var(--dark)' }} />
            </div>
        </div>
    );
}

export default AdminDelete;
