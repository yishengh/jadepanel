import {AntDesignOutlined, BookOutlined, GithubOutlined} from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '蚂蚁集团体验技术部出品',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'blog',
          title: (
            <>
              <BookOutlined style={{ marginRight: 8 }} />
              Blog
            </>
          ),
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: (
            <>
              <GithubOutlined style={{ marginRight: 8 }} />
              Github
            </>
          ),
          href: 'https://github.com/yishengh',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: (
            <>
              <AntDesignOutlined style={{ marginRight: 8 }} />
              Ant Design
            </>
          ),
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
