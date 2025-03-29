import React, { useEffect, useState } from 'react';
import styles from './TagList.module.css'; // Подключим стили

const TagList = ({ tagsData, onTagClick }) => {
    const [tagCounts, setTagCounts] = useState({});

    useEffect(() => {
        const counts = tagsData.reduce((acc, item) => {
            const tag = item.tag;
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});
        setTagCounts(counts);
    }, [tagsData]);

    return (
        <div className={styles.tag_list}>
            {
                Object.entries(tagCounts).map(([tag, count]) => (
                    <span
                        key={tag}
                        className={styles.tag}
                        onClick={() => onTagClick(tag)}
                    >
                        <span className={styles.tag_count}>{count}</span>
                        <span className={styles.tag_text}>{tag}</span>
                    </span>
                ))
            }
        </div>
    );
};

export default TagList;
