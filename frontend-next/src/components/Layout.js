import { Layout as AntLayout } from 'antd';
import { Header } from './Header';

const { Content } = AntLayout;

export default function Layout({ children }) {
    return (
        <AntLayout className="min-h-screen">
            <Header />
            <Content className="p-6">
                {children}
            </Content>
        </AntLayout>
    );
} 