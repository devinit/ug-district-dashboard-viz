import { Children, FC, isValidElement, ReactNode } from 'react';
import { TabContent } from './TabContent';

interface TabContainerProps {
  id: string;
  label: string;
  active?: boolean;
  onActivate?: () => void;
  children?: ReactNode;
}

const TabContainer: FC<TabContainerProps> = ({ id, active, label, children, onActivate }) => {
  const renderContent = (): ReactNode =>
    Children.map(children, (child) => (isValidElement(child) && child.type === TabContent ? child : null));

  return (
    <section className="tabs__container" id={id}>
      <input className="tabs__input" type="radio" name="sections" id={`${id}-option`} defaultChecked={active} />
      <label className="tabs__label" htmlFor={`${id}-option`} onClick={onActivate}>
        {label}
      </label>
      {renderContent()}
    </section>
  );
};

export { TabContainer };
