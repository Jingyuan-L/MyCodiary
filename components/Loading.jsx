import { Spin } from "antd";

const loading = () => (
    <div className="root">
        <Spin></Spin>
            <style jsx>
                {`
                .root {
                    position: fixed;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.3);
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                `}
            </style>
    </div>
)

export default loading