import React, { useRef } from 'react'
import { signal, useSignalEffect } from '@preact/signals-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faL } from '@fortawesome/free-solid-svg-icons';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

import { myId, userId, messages, filePreviewURL } from '../../signals/signals'

import { socket } from '../../../../services/lib/stocket';
import { apiService } from '../../../../services'

const messageInput = signal('');
const file = signal(null);
const showEmojiPicker = signal(false);
const isFormValid = signal(false);

export default function SendMessage() {
    const fileInputRef = useRef(null);

    useSignalEffect(() => {
        if (messageInput.value.trim() !== '' || file.value !== null || userId.value.toString().trim() !== '') {
            isFormValid.value = true;
        } else {
            isFormValid.value = false;
        }
    });

    const handleFileInputChange = (e) => {
        const fileSelected = e.target.files[0];
        if (fileSelected) {
            const reader = new FileReader();
            reader.onloadend = (event) => {
                const fileData = event.target.result;
                // Set the file preview URL
                filePreviewURL.value = fileData;
            };
            reader.readAsDataURL(fileSelected);
            file.value = fileSelected;
        }
    };

    const pickerPanelHandler = (event) => {
        event.stopPropagation();
    };

    const handleEmojiSelect = (emoji) => {
        messageInput.value = messageInput.value + emoji.native;
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            if (file.value !== null) {
                const formData = new FormData();
                formData.append('file', file.value);
                formData.append('usersData', JSON.stringify({ from: myId, to: userId }));

                const res = await apiService.sendMessage(formData);
                const resData = await res.data;

                socket.emit('sendMessage', {
                    from: myId.value,
                    name: 'test',
                    to: userId.value,
                    message: resData.file,
                    type: 'file',
                });

                // Show the sent message in the chat window
                messages.value = [
                    ...messages.value,
                    { from: 'You', message: resData.file, type: 'file' },
                ];

                messageInput.value = '';
                showEmojiPicker.value = false;
            }

            if (messageInput.value.trim() !== '' && messageInput.value !== null && userId.value.toString().trim() !== '' && userId !== null) {
                socket.emit('sendMessage', {
                    from: myId,
                    name: 'test',
                    to: userId,
                    message: messageInput.value,
                    type: 'text',
                });

                // Show the sent message in the chat window
                messages.value = [
                    ...messages.value,
                    { from: 'You', message: messageInput.value, type: 'text' },
                ];

                messageInput.value = '';
                showEmojiPicker.value = false;
            }

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            filePreviewURL.value = '';
            file.value = null;
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <form onSubmit={handleSendMessage} className='sendMessage'>
            <input
                type="text"
                value={messageInput.value}
                onChange={(e) => messageInput.value = e.target.value}
                placeholder="Type your message..."
            />

            <input
                style={{ 'color': 'black' }}
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept=".jpg, .jpeg, .png, .gif, .pdf, .doc, .docx, .txt"
            />

            <button className='emojiPanelBtn' type="button" onClick={() => showEmojiPicker.value = !showEmojiPicker.value}>
                <FontAwesomeIcon icon={faFaceSmile} />
            </button>

            {showEmojiPicker.value && (
                <div className='pickerPanel' onClick={pickerPanelHandler}>
                    <Picker
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        emojiSize={20}
                        emojiButtonSize={30}
                        perLine={7}
                    />
                </div>
            )}
            <button type="submit" disabled={!isFormValid.value}>Send</button>
        </form>
    );
}
